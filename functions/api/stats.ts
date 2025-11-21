// Cloudflare Pages Functions - 使用 Cloudflare Workers 格式
export async function onRequestGet(context: any) {
  const { env } = context;
  
  try {
    const db = env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取总访问数
    const totalViews = await db.prepare(
      'SELECT COUNT(*) as count FROM page_views'
    ).first();

    // 获取独立访客数（基于 session_id）
    const uniqueVisitors = await db.prepare(
      'SELECT COUNT(DISTINCT session_id) as count FROM page_views'
    ).first();

    // 获取总排序提交数
    const totalRankings = await db.prepare(
      'SELECT COUNT(*) as count FROM user_rankings'
    ).first();

    // 获取排序分布（每个选项被选为第1位的次数）
    const firstChoiceStats = await db.prepare(`
      SELECT 
        json_extract(ranking_order, '$[0]') as first_choice,
        COUNT(*) as count
      FROM user_rankings
      GROUP BY first_choice
      ORDER BY count DESC
    `).all();

    // 获取语言分布
    const languageStats = await db.prepare(`
      SELECT 
        language,
        COUNT(*) as count
      FROM page_views
      GROUP BY language
      ORDER BY count DESC
    `).all();

    // 获取国家/地区分布
    const countryStats = await db.prepare(`
      SELECT 
        country_code,
        COUNT(*) as count
      FROM page_views
      WHERE country_code != 'XX'
      GROUP BY country_code
      ORDER BY count DESC
      LIMIT 20
    `).all();

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
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

