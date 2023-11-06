const handleAllPatientData = (req, res, db) => {
    db('patient')
        .select('*')
        .then(patients => {
            res.json(patients);
        })
        .catch(error => {
            console.error('Error fetching patient data:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
}
export default { handleAllPatientData };

