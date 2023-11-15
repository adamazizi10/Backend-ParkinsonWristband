const handleGetSpecificPatientDetails = (req, res, db) => {
    const patientId = req.params.id; // Get the patient ID from the URL parameter

    // Query your database to retrieve patient details based on patientId
    db('patient')
        .select('*', /* other patient details */)
        .where('id', patientId) // Assuming your patient table has an 'id' column
        .then((patientDetails) => {
            if (patientDetails.length === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                res.json(patientDetails[0]); // Assuming you expect only one patient with the given ID
            }
        })
        .catch((error) => {
            console.error('Error fetching patient details:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
}

export default { handleGetSpecificPatientDetails };