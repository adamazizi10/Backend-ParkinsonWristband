// In your server.js or routes file
const handleDoctorSignIn = (req, res, db) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password." });
    }

    db('doctor')
        .select('*') // Select the required fields
        .where({ email, password })
        .then(doctor => {
            if (doctor.length === 1) {
                res.status(200).json(doctor[0]); // Return the doctor's information directly
            } else {
                res.status(401).json({ error: "Invalid email or password." });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        });
};

export default { handleDoctorSignIn };
