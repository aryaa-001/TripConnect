import AppError from "../errors/AppError.js";

const notFound = (req, res, next)=>{
    next(new AppError("Page not found", 404));
};

export default notFound;