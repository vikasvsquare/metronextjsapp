export async function POST(req){
    try {
        const { username, email, password } = await req.json();
        console.log(username, email, password);
        return;
    } catch (error) {   
        console.log(error);
    }
}