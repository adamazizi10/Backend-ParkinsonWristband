const handleAddPatient = (req, res, db) => {
    const { first_name, last_name, age, doctor_id, parkinson_status} = req.body;

    if (!first_name || !last_name || !age || !doctor_id) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    db('patient')
        .select('*')
        .where({ first_name, last_name, age, doctor_id, parkinson_status })
        .then(existingPatients => {
            if (existingPatients.length > 0) {
                res.status(400).json({ error: "Patient Already Exists" });
            } else {
                // Include the doctor_id when inserting the patient data
                db('patient')
                    .insert({ first_name, last_name, age, parkinson_status, doctor_id })
                    .returning('*')
                    .then(user => {
                        if (user.length > 0) {
                            res.status(201).json(user[0]);
                            console.log(user[0]);
                        } else {
                            res.status(500).json({ error: "Failed to register user." });
                        }
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

export default { handleAddPatient };
