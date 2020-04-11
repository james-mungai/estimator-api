const express = require('express')
const bodyParser = require('body-parser')
const {covid19ImpactEstimator} = require('./src/utils/estimator')
const xml2js = require('xml2js');
require('./src/db/mongoose')
const Log = require('./src/db/models/logs')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function logger(req, res, next) {
    const startHrTime = process.hrtime();
  
    res.on("finish", () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const timeTaken = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      const reqLog = {log: `${req.method}       ${req.path}       ${res.statusCode}       ${timeTaken}`}
      const log = new Log(reqLog)
      log.save()
    });
  
    next();
})
app.post(['/api/v1/on-covid-19', '/api/v1/on-covid-19/json'], (req,res) => {
    try {
        const covidEstimate = covid19ImpactEstimator(req.body)
        res.setHeader('Content-type', 'application/json')
        res.status(200).send(covidEstimate)
        
    } catch (error) {
        res.status(500).send('Server error')
    }
}
)
app.post('/api/v1/on-covid-19/xml', (req,res) => {
    try {
        const covidEstimate = covid19ImpactEstimator(req.body)
        const myBuilder = new xml2js.Builder()
        const xmlData = myBuilder.buildObject(covidEstimate)
        res.setHeader('Content-Type', 'text/xml')
        res.status(200).setHeader().send(xmlData)
    } catch (error) {
        res.status(500).send('Server Error')
    }
}
)
app.get('/api/v1/on-covid-19/logs', async (req,res) => {
    try {
        const logs = await Log.find()
        let logsText = ''
        logs.forEach(item=>{
            logsText+=`${item.log} \n`
        })
        res.setHeader('Content-Type', 'text')
        res.status(200).send(logsText)
    } catch (error) {
        res.status(500).send('Server Error')
    }
}
)

app.listen(process.env.PORT, () => {
    console.log(`app is live on port' ${process.env.PORT}`); 
}
)