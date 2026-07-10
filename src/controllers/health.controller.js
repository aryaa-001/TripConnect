import healthService from "../services/health.service.js"

class HealthController{
    getHealth(req, res){
        const result = healthService.getHealthStatus();
        return res.status(200).json(result);
    }
}

export default new HealthController;