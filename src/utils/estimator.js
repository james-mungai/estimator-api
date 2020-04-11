const covid19ImpactEstimator = (data) => {
    const {
      reportedCases, totalHospitalBeds, region, timeToElapse, periodType
    } = data;
  
    let normalisedTimeToElapse;
  
    switch (periodType) {
      case 'days':
        normalisedTimeToElapse = timeToElapse;
        break;
      case 'weeks':
        normalisedTimeToElapse = timeToElapse * 7;
        break;
      case 'months':
        normalisedTimeToElapse = timeToElapse * 30;
        break;
      default:
        break;
    }
  
    const { avgDailyIncomeInUSD } = region;
  
    const normalisedTimeFactor = 2**Math.floor(normalisedTimeToElapse / 3) ;
  
    const currentlyInfectedNormal = reportedCases * 10;
    const currentlyInfectedSevere = reportedCases * 50;
  
  
    const infectionsByRequestedTimeNormal = currentlyInfectedNormal * normalisedTimeFactor;
    const infectionsByRequestedTimeSevere = currentlyInfectedSevere * normalisedTimeFactor;
  
    const severeCasesByRequestedTimeNormal = infectionsByRequestedTimeNormal * 0.15;
    const severeCasesByRequestedTimeSevere = infectionsByRequestedTimeSevere * 0.15;
  
    const hsptlBedsByRqstdTimeNormal = Math.round(totalHospitalBeds * 0.35) - severeCasesByRequestedTimeNormal;
    const hsptlBedsByRqstdTimeSevere = Math.round(totalHospitalBeds * 0.35) - severeCasesByRequestedTimeSevere;
    
  
    const dollarsInFlightNormal = infectionsByRequestedTimeNormal * avgDailyIncomeInUSD * 30;
    const dollarsInFlightSevere = infectionsByRequestedTimeSevere * avgDailyIncomeInUSD * 30;
    return {
      data,
      impact: {
        currentlyInfected: currentlyInfectedNormal,
        infectionsByRequestedTime: infectionsByRequestedTimeNormal,
        severeCasesByRequestedTime: severeCasesByRequestedTimeNormal,
        hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeNormal,
        casesForICUByRequestedTime: infectionsByRequestedTimeNormal * 0.05,
        casesForVentilatorsByRequestedTime: infectionsByRequestedTimeSevere * 0.02,
        dollarsInFlight: dollarsInFlightNormal
      }, // best case estimation
      severeImpact: {
        currentlyInfected: currentlyInfectedSevere,
        infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
        hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeSevere,
        casesForICUByRequestedTime: infectionsByRequestedTimeSevere * 0.05,
        casesForVentilatorsByRequestedTime: infectionsByRequestedTimeSevere * 0.02,
        dollarsInFlight: dollarsInFlightSevere
  
      } // severe case estimation
    };
  };
  
  const data = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'weeks',
    timeToElapse: 4,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  }


  module.exports = {covid19ImpactEstimator}