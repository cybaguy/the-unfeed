import { isSafeUrl } from "@/src/lib/urlSafety";

export async function POST(request: Request){
    const rawBody = await request.json();
    if (typeof rawBody?.url !== 'string' || rawBody.url?.trim() === "") {
        return Response.json(
            {error: "URL is missing or invalid"},
            {status: 400}
        );
    }

    const safetyCheck = isSafeUrl(rawBody.url)
    if (!safetyCheck.safe){
        return Response.json(
            {error: safetyCheck.reason},
            {status: 400}
        );
    }

    let response : Response;
    try{
    //Fetch the target URL from the server
    response = await fetch(rawBody.url)
    }catch(err){
        console.error("fetch failed:", err)
        return Response.json(
            {error: "Failed to reach URL"},
            {status: 502}
        );
    }

    if(!response.ok){
        return Response.json(
            {error: 'Failed to fetch URL (status ${response.status})'},
            {status: 502}
        );
    }

    const html = await response.text();
    
    return Response.json({
        received: {
            url: rawBody.url, 
            bytesFetched: html.length,
            preview: html.slice(0,200),
        },
    });
}