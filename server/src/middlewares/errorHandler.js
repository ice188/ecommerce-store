module.exports = (err, req, res, next) => {

    const statusCode = 500; 
    const message = err.message; 
    console.log(err)
    res.status(statusCode).json({ message: message });
};
