const handleAllDoctorData = (req, res, db) => {
    db('doctor')
        .select('*')
        .then(doctors => {
            res.json(doctors);
        })
        .catch(error => {
            console.error('Error fetching doctor data:', error);
            res.status(500).json({ error: 'An error occurred' });
        });
}
export default { handleAllDoctorData };