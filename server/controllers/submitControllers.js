export async function handlePostSubmit (req, res) {

    const data = req.body;
    console.log(data);
    res.json({message: "data received succesfully"})

};