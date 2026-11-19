<?php
/**
 * VidyaScope - Dynamic SEO XML Sitemap Proxy & Server
 * Fetches real-time dynamic sitemap from backend API with local caching & fallback.
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=1800, s-maxage=3600');
header('X-Robots-Tag: noarchive');

$apiUrl = 'https://api.vidyascope.com/sitemap.xml';
$localFallback = __DIR__ . '/sitemap.xml';
$cacheFile = sys_get_temp_dir() . '/vidyascope_sitemap_cache.xml';
$cacheTtl = 900; // 15 minutes local cache

// 1. Check local cache first if fresh
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    $cachedData = @file_get_contents($cacheFile);
    if (!empty($cachedData) && strpos($cachedData, '<?xml') !== false) {
        http_response_code(200);
        echo $cachedData;
        exit;
    }
}

$xml = false;

// 2. Fetch fresh dynamic sitemap via cURL
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'VidyaScope-SitemapProxy/1.0 (+https://vidyascope.com)');
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && !empty($response) && strpos($response, '<?xml') !== false) {
        $xml = $response;
    }
}

// 3. Fallback: file_get_contents with stream context
if (!$xml && ini_get('allow_url_fopen')) {
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 6,
            'header' => "User-Agent: VidyaScope-SitemapProxy/1.0\r\n"
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    $response = @file_get_contents($apiUrl, false, $ctx);
    if ($response && strpos($response, '<?xml') !== false) {
        $xml = $response;
    }
}

// 4. If fresh fetch succeeded, update cache and serve
if ($xml) {
    @file_put_contents($cacheFile, $xml);
    http_response_code(200);
    echo $xml;
    exit;
}

// 5. Fallback to cached file if exists (even if stale)
if (file_exists($cacheFile)) {
    $cachedData = @file_get_contents($cacheFile);
    if (!empty($cachedData) && strpos($cachedData, '<?xml') !== false) {
        http_response_code(200);
        echo $cachedData;
        exit;
    }
}

// 6. Fallback to local static sitemap.xml in same directory
if (file_exists($localFallback)) {
    $staticData = @file_get_contents($localFallback);
    if (!empty($staticData)) {
        http_response_code(200);
        echo $staticData;
        exit;
    }
}

// 7. Last resort: Redirect directly to API endpoint
header('Location: ' . $apiUrl, true, 302);
exit;
