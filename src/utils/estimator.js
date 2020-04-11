const covid19ImpactEstimator = (data) => {
    const {
      reportedCases, totalHospitalBeds, region, timeToElapse, periodType,
    } = data;
  
    let timeToElapseInDays;
  
    switch (periodType) {
      case 'days':
        timeToElapseInDays = timeToElapse;
        break;
      case 'weeks':
        timeToElapseInDays = timeToElapse * 7;
        break;
      case 'months':
        timeToElapseInDays = timeToElapse * 30;
        break;
      default:
        break;
    }
  
    const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  
    const normalisedTimeFactor = 2**Math.floor(timeToElapseInDays / 3) ;
  
    const currentlyInfectedNormal = reportedCases * 10;
    const currentlyInfectedSevere = reportedCases * 50;
  
  
    const infectionsByRequestedTimeNormal = currentlyInfectedNormal * normalisedTimeFactor;
    const infectionsByRequestedTimeSevere = currentlyInfectedSevere * normalisedTimeFactor;
  
    const severeCasesByRequestedTimeNormal = Math.floor(infectionsByRequestedTimeNormal * 0.15);
    const severeCasesByRequestedTimeSevere = Math.floor(infectionsByRequestedTimeSevere * 0.15);
  
    const hsptlBedsByRqstdTimeNormal = Math.floor(totalHospitalBeds * 0.35) - severeCasesByRequestedTimeNormal;
    const hsptlBedsByRqstdTimeSevere = Math.floor(totalHospitalBeds * 0.35) - severeCasesByRequestedTimeSevere;
    
  
    const dollarsInFlightNormal = Math.floor(infectionsByRequestedTimeNormal * avgDailyIncomeInUSD * avgDailyIncomePopulation/30);
    const dollarsInFlightSevere = Math.floor(infectionsByRequestedTimeSevere * avgDailyIncomeInUSD * avgDailyIncomePopulation/30);
    return {
      data,
      impact: {
        currentlyInfected: currentlyInfectedNormal,
        infectionsByRequestedTime: infectionsByRequestedTimeNormal,
        severeCasesByRequestedTime: severeCasesByRequestedTimeNormal,
        hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeNormal,
        casesForICUByRequestedTime: Math.floor(infectionsByRequestedTimeNormal * 0.05),
        casesForVentilatorsByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.02),
        dollarsInFlight: dollarsInFlightNormal
      }, // best case estimation
      severeImpact: {
        currentlyInfected: currentlyInfectedSevere,
        infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
        hospitalBedsByRequestedTime: hsptlBedsByRqstdTimeSevere,
        casesForICUByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.05),
        casesForVentilatorsByRequestedTime: Math.floor(infectionsByRequestedTimeSevere * 0.02),
        dollarsInFlight: dollarsInFlightSevere
  
      } // severe case estimation
    };
  };
  

  module.exports = {covid19ImpactEstimator}