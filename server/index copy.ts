import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
// import { db } from './database.js';

// Load environment variables
dotenv.config();

console.log('🚀 Starting Sheesh Server...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Data Directory: ${process.env.DATA_DIRECTORY || './data'}`);

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint - MUST be first
app.get('/health', (req: express.Request, res: express.Response) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
  return;
});

// API Routes
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  console.log('🔐 Login attempt:', req.body.username);
  try {
    const { username, password } = req.body;
    
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .where('password', '=', password)
      .executeTakeFirst();
    
    if (user) {
      console.log('✅ Login successful for user:', user.username);
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      console.log('❌ Login failed for username:', username);
      res.status(401).json({ error: 'Invalid username or password' });
    }
    return;
  } catch (error) {
    console.error('💥 Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
    return;
  }
});

app.post('/api/users', async (req: express.Request, res: express.Response) => {
  console.log('👤 Creating user:', req.body);
  try {
    const { firstName, lastName, username, email, password } = req.body;
    
    const existingUser = await db
      .selectFrom('users')
      .select(['username', 'email'])
      .where((eb) => eb.or([
        eb('username', '=', username),
        eb('email', '=', email)
      ]))
      .executeTakeFirst();
    
    if (existingUser) {
      let error = 'User already exists';
      if (existingUser.username === username) {
        error = 'Username already taken';
      } else if (existingUser.email === email) {
        error = 'Email already registered';
      }
      res.status(400).json({ error });
      return;
    }
    
    const user = await db
      .insertInto('users')
      .values({ 
        first_name: firstName,
        last_name: lastName,
        username, 
        email,
        password,
        is_private: 0
      })
      .returning(['id', 'first_name', 'last_name', 'username', 'email', 'display_name', 'is_private', 'created_at'])
      .executeTakeFirst();
    
    console.log('✅ User created:', user);
    
    if (user) {
      try {
        await db
          .insertInto('group_members')
          .values({ group_id: 1, user_id: user.id })
          .execute();
        console.log('✅ User automatically added to Sheesh group');
      } catch (groupError) {
        console.error('⚠️ Error adding user to Sheesh group:', groupError);
      }
    }
    
    res.json(user);
    return;
  } catch (error) {
    console.error('💥 Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
});

app.put('/api/users/:userId', async (req: express.Request, res: express.Response) => {
  console.log('👤 Updating user:', req.params.userId, req.body);
  try {
    const { userId } = req.params;
    const { firstName, lastName, displayName, email, isPrivate } = req.body;
    
    const user = await db
      .updateTable('users')
      .set({ 
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        email,
        is_private: isPrivate ? 1 : 0
      })
      .where('id', '=', parseInt(userId, 10))
      .returning(['id', 'first_name', 'last_name', 'username', 'email', 'display_name', 'is_private', 'created_at'])
      .executeTakeFirst();
    
    if (user) {
      console.log('✅ User updated:', user);
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
    return;
  } catch (error) {
    console.error('💥 Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
    return;
  }
});

app.get('/api/users/:userId/groups', async (req: express.Request, res: express.Response) => {
  console.log('👥 Fetching groups for user:', req.params.userId);
  try {
    const { userId } = req.params;
    
    const groups = await db
      .selectFrom('groups')
      .innerJoin('group_members', 'groups.id', 'group_members.group_id')
      .select([
        'groups.id',
        'groups.name',
        'groups.description',
        'groups.created_by',
        'groups.is_private',
        'groups.join_code',
        'groups.created_at'
      ])
      .where('group_members.user_id', '=', parseInt(userId, 10))
      .execute();
    
    console.log('✅ Found groups for user:', groups.length);
    res.json(groups);
    return;
  } catch (error) {
    console.error('💥 Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
    return;
  }
});

// Screentime endpoints
app.post('/api/screentime', async (req: express.Request, res: express.Response) => {
  console.log('📱 Creating screentime entry:', req.body);
  try {
    const { userId, date, totalMinutes, categoryBreakdown } = req.body;
    
    if (!userId || !date || typeof totalMinutes !== 'number') {
      res.status(400).json({ error: 'Missing required fields: userId, date, totalMinutes' });
      return;
    }
    
    const categoryBreakdownJson = categoryBreakdown ? JSON.stringify(categoryBreakdown) : null;
    
    const existing = await db
      .selectFrom('screentime_entries')
      .select(['id'])
      .where('user_id', '=', userId)
      .where('date', '=', date)
      .executeTakeFirst();
    
    if (existing) {
      const entry = await db
        .updateTable('screentime_entries')
        .set({ 
          minutes: totalMinutes,
          category_breakdown: categoryBreakdownJson
        })
        .where('user_id', '=', userId)
        .where('date', '=', date)
        .returning(['id', 'user_id', 'date', 'minutes', 'category_breakdown', 'uploaded_at'])
        .executeTakeFirst();
      
      console.log('✅ Screentime entry updated:', entry);
      res.json({
        ...entry,
        totalMinutes: entry?.minutes,
        categoryBreakdown: entry?.category_breakdown ? JSON.parse(entry.category_breakdown) : []
      });
    } else {
      const entry = await db
        .insertInto('screentime_entries')
        .values({ 
          user_id: userId, 
          date, 
          minutes: totalMinutes,
          category_breakdown: categoryBreakdownJson
        })
        .returning(['id', 'user_id', 'date', 'minutes', 'category_breakdown', 'uploaded_at'])
        .executeTakeFirst();
      
      console.log('✅ Screentime entry created:', entry);
      res.json({
        ...entry,
        totalMinutes: entry?.minutes,
        categoryBreakdown: entry?.category_breakdown ? JSON.parse(entry.category_breakdown) : []
      });
    }
    return;
  } catch (error) {
    console.error('💥 Error creating screentime entry:', error);
    res.status(500).json({ error: 'Failed to create screentime entry' });
    return;
  }
});

app.get('/api/screentime/:userId', async (req: express.Request, res: express.Response) => {
  console.log('📱 Fetching screentime for user:', req.params.userId);
  try {
    const { userId } = req.params;
    
    const entries = await db
      .selectFrom('screentime_entries')
      .selectAll()
      .where('user_id', '=', parseInt(userId, 10))
      .orderBy('date', 'desc')
      .execute();
    
    const transformedEntries = entries.map(entry => ({
      ...entry,
      totalMinutes: entry.minutes,
      categoryBreakdown: entry.category_breakdown ? JSON.parse(entry.category_breakdown) : []
    }));
    
    console.log('✅ Found screentime entries:', entries.length);
    res.json(transformedEntries);
    return;
  } catch (error) {
    console.error('💥 Error fetching screentime:', error);
    res.status(500).json({ error: 'Failed to fetch screentime' });
    return;
  }
});

// Groups endpoints
app.post('/api/groups', async (req: express.Request, res: express.Response) => {
  console.log('👥 Creating group:', req.body);
  try {
    const { name, description, isPrivate, joinCode, createdBy } = req.body;
    
    const isPrivateInt = isPrivate ? 1 : 0;
    
    const group = await db
      .insertInto('groups')
      .values({ 
        name, 
        description, 
        is_private: isPrivateInt,
        join_code: joinCode,
        created_by: createdBy 
      })
      .returning(['id', 'name', 'description', 'created_by', 'is_private', 'join_code', 'created_at'])
      .executeTakeFirst();
    
    console.log('✅ Group created:', group);
    res.json(group);
    return;
  } catch (error) {
    console.error('💥 Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
    return;
  }
});

app.put('/api/groups/:groupId', async (req: express.Request, res: express.Response) => {
  console.log('👥 Updating group:', req.params.groupId, req.body);
  try {
    const { groupId } = req.params;
    const { name, description, isPrivate, joinCode } = req.body;
    
    const isPrivateInt = isPrivate ? 1 : 0;
    
    const group = await db
      .updateTable('groups')
      .set({ 
        name,
        description,
        is_private: isPrivateInt,
        join_code: joinCode
      })
      .where('id', '=', parseInt(groupId, 10))
      .returning(['id', 'name', 'description', 'created_by', 'is_private', 'join_code', 'created_at'])
      .executeTakeFirst();
    
    if (group) {
      console.log('✅ Group updated:', group);
      res.json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
    return;
  } catch (error) {
    console.error('💥 Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
    return;
  }
});

app.delete('/api/groups/:groupId', async (req: express.Request, res: express.Response) => {
  console.log('👥 Deleting group:', req.params.groupId);
  try {
    const { groupId } = req.params;
    
    await db
      .deleteFrom('group_members')
      .where('group_id', '=', parseInt(groupId, 10))
      .execute();
    
    await db
      .deleteFrom('groups')
      .where('id', '=', parseInt(groupId, 10))
      .execute();
    
    console.log('✅ Group deleted successfully');
    res.json({ success: true });
    return;
  } catch (error) {
    console.error('💥 Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
    return;
  }
});

app.get('/api/groups', async (req: express.Request, res: express.Response) => {
  console.log('👥 Fetching all groups');
  try {
    const groups = await db
      .selectFrom('groups')
      .leftJoin('group_members', 'groups.id', 'group_members.group_id')
      .select([
        'groups.id',
        'groups.name',
        'groups.description',
        'groups.created_by',
        'groups.is_private',
        'groups.join_code',
        'groups.created_at',
        db.fn.count('group_members.id').as('member_count')
      ])
      .groupBy(['groups.id', 'groups.name', 'groups.description', 'groups.created_by', 'groups.is_private', 'groups.join_code', 'groups.created_at'])
      .execute();
    
    console.log('✅ Found groups:', groups.length);
    res.json(groups);
    return;
  } catch (error) {
    console.error('💥 Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
    return;
  }
});

app.get('/api/groups/:groupId/members', async (req: express.Request, res: express.Response) => {
  console.log('👥 Fetching group members:', req.params.groupId);
  try {
    const { groupId } = req.params;
    
    const members = await db
      .selectFrom('users')
      .innerJoin('group_members', 'users.id', 'group_members.user_id')
      .select([
        'users.id',
        'users.username',
        'users.first_name',
        'users.last_name',
        'users.display_name',
        'group_members.joined_at'
      ])
      .where('group_members.group_id', '=', parseInt(groupId, 10))
      .orderBy('group_members.joined_at', 'asc')
      .execute();
    
    console.log('✅ Found group members:', members.length);
    res.json(members);
    return;
  } catch (error) {
    console.error('💥 Error fetching group members:', error);
    res.status(500).json({ error: 'Failed to fetch group members' });
    return;
  }
});

app.post('/api/groups/:groupId/join', async (req: express.Request, res: express.Response) => {
  console.log('👥 Joining group:', req.params.groupId, 'user:', req.body.userId);
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    
    const existingMember = await db
      .selectFrom('group_members')
      .select(['id'])
      .where('group_id', '=', parseInt(groupId, 10))
      .where('user_id', '=', userId)
      .executeTakeFirst();
    
    if (existingMember) {
      res.status(400).json({ error: 'User is already a member of this group' });
      return;
    }
    
    const membership = await db
      .insertInto('group_members')
      .values({ group_id: parseInt(groupId, 10), user_id: userId })
      .returning(['id', 'group_id', 'user_id', 'joined_at'])
      .executeTakeFirst();
    
    console.log('✅ Group membership created:', membership);
    res.json(membership);
    return;
  } catch (error) {
    console.error('💥 Error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
    return;
  }
});

app.post('/api/groups/join-by-code', async (req: express.Request, res: express.Response) => {
  console.log('👥 Joining group by code:', req.body.joinCode);
  try {
    const { joinCode, userId } = req.body;
    
    const group = await db
      .selectFrom('groups')
      .select(['id'])
      .where('join_code', '=', joinCode)
      .where('is_private', '=', 1)
      .executeTakeFirst();
    
    if (!group) {
      res.status(404).json({ error: 'Invalid join code' });
      return;
    }
    
    const existingMember = await db
      .selectFrom('group_members')
      .select(['id'])
      .where('group_id', '=', group.id)
      .where('user_id', '=', userId)
      .executeTakeFirst();
    
    if (existingMember) {
      res.status(400).json({ error: 'You are already a member of this group' });
      return;
    }
    
    const membership = await db
      .insertInto('group_members')
      .values({ group_id: group.id, user_id: userId })
      .returning(['id', 'group_id', 'user_id', 'joined_at'])
      .executeTakeFirst();
    
    console.log('✅ Group membership created via join code:', membership);
    res.json(membership);
    return;
  } catch (error) {
    console.error('💥 Error joining group by code:', error);
    res.status(500).json({ error: 'Failed to join group' });
    return;
  }
});

app.delete('/api/groups/:groupId/members/:userId', async (req: express.Request, res: express.Response) => {
  console.log('👥 Removing user from group:', req.params.groupId, req.params.userId);
  try {
    const { groupId, userId } = req.params;
    
    await db
      .deleteFrom('group_members')
      .where('group_id', '=', parseInt(groupId, 10))
      .where('user_id', '=', parseInt(userId, 10))
      .execute();
    
    console.log('✅ User removed from group successfully');
    res.json({ success: true });
    return;
  } catch (error) {
    console.error('💥 Error removing user from group:', error);
    res.status(500).json({ error: 'Failed to remove user from group' });
    return;
  }
});

// Group leaderboard endpoint
app.get('/api/groups/:groupId/leaderboard', async (req: express.Request, res: express.Response) => {
  console.log('🏆 Fetching group leaderboard:', req.params.groupId, 'type:', req.query.type);
  try {
    const { groupId } = req.params;
    const { type } = req.query;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let leaderboard = [];
    const groupIdNum = parseInt(groupId, 10);
    const isSheeshGroup = groupIdNum === 1;

    if (type === 'today') {
      const rawData = await db
        .selectFrom('users')
        .innerJoin('group_members', 'users.id', 'group_members.user_id')
        .leftJoin('screentime_entries', (join) =>
          join
            .onRef('users.id', '=', 'screentime_entries.user_id')
            .on('screentime_entries.date', '=', today)
        )
        .select([
          'users.id',
          'users.username',
          'users.first_name',
          'users.last_name',
          'users.display_name',
          'users.is_private',
          'screentime_entries.minutes as today_screentime'
        ])
        .where('group_members.group_id', '=', groupIdNum)
        .execute();

      const processedData = rawData.map(user => ({
        ...user,
        today_screentime: (isSheeshGroup && user.is_private) ? 0 : user.today_screentime,
        is_private_hidden: isSheeshGroup && user.is_private
      }));

      const usersWithData = processedData.filter(user => 
        user.today_screentime > 0 && !user.is_private_hidden
      );
      const hiddenUsers = processedData.filter(user => 
        (!user.today_screentime || user.today_screentime === 0) || user.is_private_hidden
      );

      usersWithData.sort((a, b) => a.today_screentime - b.today_screentime);
      leaderboard = [...usersWithData, ...hiddenUsers];

    } else if (type === 'yesterday') {
      const rawData = await db
        .selectFrom('users')
        .innerJoin('group_members', 'users.id', 'group_members.user_id')
        .leftJoin('screentime_entries', (join) =>
          join
            .onRef('users.id', '=', 'screentime_entries.user_id')
            .on('screentime_entries.date', '=', yesterday)
        )
        .select([
          'users.id',
          'users.username',
          'users.first_name',
          'users.last_name',
          'users.display_name',
          'users.is_private',
          'screentime_entries.minutes as yesterday_screentime'
        ])
        .where('group_members.group_id', '=', groupIdNum)
        .execute();

      const processedData = rawData.map(user => ({
        ...user,
        yesterday_screentime: (isSheeshGroup && user.is_private) ? 0 : user.yesterday_screentime,
        is_private_hidden: isSheeshGroup && user.is_private
      }));

      const usersWithData = processedData.filter(user => 
        user.yesterday_screentime > 0 && !user.is_private_hidden
      );
      const hiddenUsers = processedData.filter(user => 
        (!user.yesterday_screentime || user.yesterday_screentime === 0) || user.is_private_hidden
      );

      usersWithData.sort((a, b) => a.yesterday_screentime - b.yesterday_screentime);
      leaderboard = [...usersWithData, ...hiddenUsers];

    } else if (type === 'weekly') {
      const rawData = await db
        .selectFrom('users')
        .innerJoin('group_members', 'users.id', 'group_members.user_id')
        .leftJoin('screentime_entries', (join) =>
          join
            .onRef('users.id', '=', 'screentime_entries.user_id')
            .on('screentime_entries.date', '>=', oneWeekAgo)
        )
        .select([
          'users.id',
          'users.username',
          'users.first_name',
          'users.last_name',
          'users.display_name',
          'users.is_private',
          db.fn.avg('screentime_entries.minutes').as('weekly_average_raw'),
          db.fn.count('screentime_entries.id').as('days_this_week')
        ])
        .where('group_members.group_id', '=', groupIdNum)
        .groupBy(['users.id', 'users.username', 'users.first_name', 'users.last_name', 'users.display_name', 'users.is_private'])
        .execute();

      const processedData = rawData.map(user => {
        const calculatedAverage = user.weekly_average_raw ? Math.round(Number(user.weekly_average_raw)) : 0;
        return {
          ...user,
          weekly_average: (isSheeshGroup && user.is_private) ? 0 : calculatedAverage,
          is_private_hidden: isSheeshGroup && user.is_private
        };
      });

      const usersWithData = processedData.filter(user => 
        user.weekly_average > 0 && !user.is_private_hidden
      );
      const hiddenUsers = processedData.filter(user => 
        user.weekly_average === 0 || user.is_private_hidden
      );

      usersWithData.sort((a, b) => a.weekly_average - b.weekly_average);
      leaderboard = [...usersWithData, ...hiddenUsers];

    } else if (type === 'change') {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const currentPeriodData = await db
        .selectFrom('users')
        .innerJoin('group_members', 'users.id', 'group_members.user_id')
        .leftJoin('screentime_entries', (join) =>
          join
            .onRef('users.id', '=', 'screentime_entries.user_id')
            .on('screentime_entries.date', '>=', threeDaysAgo)
            .on('screentime_entries.date', '<', today)
        )
        .select([
          'users.id',
          'users.username',
          'users.first_name',
          'users.last_name',
          'users.display_name',
          'users.is_private',
          db.fn.avg('screentime_entries.minutes').as('current_average_raw'),
          db.fn.count('screentime_entries.id').as('current_days')
        ])
        .where('group_members.group_id', '=', groupIdNum)
        .groupBy(['users.id', 'users.username', 'users.first_name', 'users.last_name', 'users.display_name', 'users.is_private'])
        .execute();

      const previousPeriodData = await db
        .selectFrom('users')
        .innerJoin('group_members', 'users.id', 'group_members.user_id')
        .leftJoin('screentime_entries', (join) =>
          join
            .onRef('users.id', '=', 'screentime_entries.user_id')
            .on('screentime_entries.date', '>=', sixDaysAgo)
            .on('screentime_entries.date', '<', threeDaysAgo)
        )
        .select([
          'users.id',
          db.fn.avg('screentime_entries.minutes').as('previous_average_raw'),
          db.fn.count('screentime_entries.id').as('previous_days')
        ])
        .where('group_members.group_id', '=', groupIdNum)
        .groupBy(['users.id'])
        .execute();

      leaderboard = currentPeriodData.map(user => {
        const previousData = previousPeriodData.find(p => p.id === user.id);
        const currentAvg = user.current_average_raw ? Math.round(Number(user.current_average_raw)) : 0;
        const previousAvg = previousData?.previous_average_raw ? Math.round(Number(previousData.previous_average_raw)) : 0;
        
        let percentageChange = null;
        if (previousAvg > 0 && currentAvg !== null) {
          percentageChange = ((currentAvg - previousAvg) / previousAvg) * 100;
        }

        const isPrivateHidden = isSheeshGroup && user.is_private;

        return {
          ...user,
          current_average: isPrivateHidden ? 0 : currentAvg,
          previous_average: isPrivateHidden ? 0 : previousAvg,
          percentage_change: isPrivateHidden ? null : percentageChange,
          is_private_hidden: isPrivateHidden
        };
      }).sort((a, b) => {
        if (a.percentage_change === null && b.percentage_change === null) return 0;
        if (a.percentage_change === null) return 1;
        if (b.percentage_change === null) return -1;
        return a.percentage_change - b.percentage_change;
      });
    }

    console.log('✅ Group leaderboard data:', leaderboard.length, 'users');
    res.json(leaderboard);
    return;
  } catch (error) {
    console.error('💥 Error fetching group leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch group leaderboard' });
    return;
  }
});

// API health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  console.log('🔍 API Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
  return;
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
  return;
});

// Export a function to start the server
export async function startServer(port: number) {
  return new Promise<any>((resolve, reject) => {
    console.log(`🚀 Starting server on port ${port}...`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🏭 Production mode - setting up static serving');
      setupStaticServing(app);
    }
    
    const server = app.listen(port, () => {
      console.log(`✅ Server successfully started on port ${port}`);
      console.log(`🌐 Access the app at: http://localhost:${port}`);
      resolve(server);
    });
    
    server.on('error', (error: any) => {
      console.error(`💥 Server error on port ${port}:`, error);
      if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${port} is already in use`);
      }
      reject(error);
    });
  });
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  console.log(`🎯 Starting server directly on port ${port}...`);
  
  startServer(port).catch((error) => {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  });
}