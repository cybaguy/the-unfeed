export async function POST(request: Request){
    const rawBody = await request.json();
    if (typeof rawBody?.url !== 'string' || rawBody?.url.trim() === "") {
        return Response.json(
            {error: "URL is missing or invalid"},
            {status: 400}
        );
    }
    return Response.json({received: {url: rawBody.url}});
}