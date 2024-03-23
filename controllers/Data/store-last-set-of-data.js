// In store-last-set-of-data.js
const handleStoreLastSetOfData = async (req, res, db) => {
    const { id } = req.params; // Assuming the patient ID is passed as a parameter
    const { x, y, z, t, parkinson_status, x_mean, y_mean, z_mean, x_std, y_std, z_std } = req.body;

    try {
        // Update the patient data in the database
        const databaseData = await db('patient')
            .where({ id })
            .update({ x, y, z, t, parkinson_status, x_mean, y_mean, z_mean, x_std, y_std, z_std })
            .returning('*');

        res.status(200).json(databaseData);
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'An error occurred while storing the data' });
    }
};

export default { handleStoreLastSetOfData };
