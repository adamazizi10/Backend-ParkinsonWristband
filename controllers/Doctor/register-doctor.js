const handleDoctorRegistration = (req, res, db) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Check if the doctor with the same email already exists
    db('doctor')
        .select('*')
        .where({ email })
        .then(existingDoctors => {
            if (existingDoctors.length > 0) {
                res.status(400).json({ error: "Doctor Already Exists" });
            } else {
                // If the doctor doesn't exist, insert them into the database.
                db('doctor')
                    .insert({ first_name, last_name, email, password })
                    .returning('*') // Return the required fields
                    .then(doctorData => {
                        res.status(201).json(doctorData[0]);
                        console.log('Doctor registered with ID:', doctorData[0].id);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ error: "Internal server error." });
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        });
};

export default { handleDoctorRegistration };