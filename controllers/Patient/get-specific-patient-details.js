const handleGetSpecificPatientDetails = (req, res, db) => {
    const patientId = req.params.id; // Get the patient ID from the URL parameter

   
    db('patient')
        .select('*', /* other patient details */)
        .where('id', patientId)
        .then((patientDetails) => {
            if (patientDetails.length === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                res.json(patientDetails[0]); 
            }
        })
        .catch((error) => {
            console.error('Error fetching patient details:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
}

export default { handleGetSpecificPatientDetails };
