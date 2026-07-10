class HealthService{
    getHealthStatus(){
        return {
            success: true,
            message: "Server is healthy",
        }
    }
}

export default new HealthService();