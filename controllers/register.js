const handleRegister = (req, res, db) => {
    const { first_name, last_name, age } = req.body;

    if (!first_name || !last_name || !age) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    db('patient')
        .insert({ first_name, last_name, age })
        .returning('*')
        .then(user => {
            if (user.length > 0) {
                console.log('hi')
                res.status(201).json(user[0]);
            } else {
                res.status(500).json({ error: "Failed to register user." });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        });
}
export default { handleRegister };