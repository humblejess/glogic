// Cloudflare Pages Functions - 使用 Cloudflare Workers 格式
export async function onRequestGet(context: any) {
  const { env } = context;
  
  try {
    const db = env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Database not available',
        debug: {
          hasEnv: !!env,
          envKeys: env ? Object.keys(env) : [],
          dbType: typeof db
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取总访问数（如果表不存在会返回 null）
    let totalViews: any = { count: 0 };
    try {
      totalViews = await db.prepare(
        'SELECT COUNT(*) as count FROM page_views'
      ).first() || { count: 0 };
    } catch (e) {
      console.error('Error fetching total views:', e);
    }

    // 获取独立访客数（基于 session_id）
    let uniqueVisitors: any = { count: 0 };
    try {
      uniqueVisitors = await db.prepare(
        'SELECT COUNT(DISTINCT session_id) as count FROM page_views'
      ).first() || { count: 0 };
    } catch (e) {
      console.error('Error fetching unique visitors:', e);
    }

    // 获取总排序提交数
    let totalRankings: any = { count: 0 };
    try {
      totalRankings = await db.prepare(
        'SELECT COUNT(*) as count FROM user_rankings'
      ).first() || { count: 0 };
    } catch (e) {
      console.error('Error fetching total rankings:', e);
    }

    // 获取排序分布（每个选项被选为第1位的次数）
    // 注意：D1 可能不支持 json_extract，改用应用层处理
    let firstChoiceStats: any[] = [];
    try {
      const allRankings = await db.prepare(
        'SELECT ranking_order FROM user_rankings'
      ).all();
      
      // 在应用层解析 JSON 并统计
      const firstChoiceMap: Record<string, number> = {};
      if (allRankings?.results) {
        for (const row of allRankings.results) {
          try {
            const ranking = JSON.parse(row.ranking_order as string);
            if (Array.isArray(ranking) && ranking.length > 0) {
              const first = ranking[0];
              firstChoiceMap[first] = (firstChoiceMap[first] || 0) + 1;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
      
      firstChoiceStats = Object.entries(firstChoiceMap)
        .map(([first_choice, count]) => ({ first_choice, count }))
        .sort((a, b) => (b.count as number) - (a.count as number));
    } catch (e) {
      console.error('Error processing first choice stats:', e);
    }

    // 获取语言分布
    let languageStats: any = { results: [] };
    try {
      languageStats = await db.prepare(`
        SELECT 
          language,
          COUNT(*) as count
        FROM page_views
        GROUP BY language
        ORDER BY count DESC
      `).all();
    } catch (e) {
      console.error('Error fetching language stats:', e);
    }

    // 获取国家/地区分布
    let countryStats: any = { results: [] };
    try {
      countryStats = await db.prepare(`
        SELECT 
          country_code,
          COUNT(*) as count
        FROM page_views
        WHERE country_code != 'XX'
        GROUP BY country_code
        ORDER BY count DESC
        LIMIT 20
      `).all();
    } catch (e) {
      console.error('Error fetching country stats:', e);
    }

    return new Response(JSON.stringify({
      totalViews: totalViews?.count || 0,
      uniqueVisitors: uniqueVisitors?.count || 0,
      totalRankings: totalRankings?.count || 0,
      firstChoiceStats: firstChoiceStats?.results || [],
      languageStats: languageStats?.results || [],
      countryStats: countryStats?.results || []
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // 缓存60秒
      }
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    // 返回详细错误信息用于调试（生产环境可以隐藏）
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      stack: error?.stack || ''
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

