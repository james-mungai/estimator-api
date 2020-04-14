const getCurrentlyinfectedN = (reportedCases) => reportedCases * 10;

const getCurrentlyinfectedS = (reportedCases) => reportedCases * 50;

const getInfections = (currentlyInfected, factor) => currentlyInfected * factor;

const getSevereCases = (infections) => Math.trunc(0.15 * infections);

const getIcuCare = (infections) => Math.trunc(0.05 * infections);

const getVentilators = (infections) => Math.trunc(0.02 * infections);

const getDolarflight = (curInfctd, avgDailyUSD, avDailInPop, time) => (
  Math.trunc((curInfctd * avgDailyUSD * avDailInPop) / time));

const gettimeInDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const getTimeFactor = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'days':
      return 2 ** Math.trunc(timeToElapse / 3);
    case 'weeks':
      return 2 ** Math.trunc((timeToElapse * 7) / 3);
    case 'months':
      return 2 ** Math.trunc((timeToElapse * 30) / 3);
    default:
      return 2 ** Math.trunc(timeToElapse / 3);
  }
};

const getHospitalBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableBeds = 0.35 * totalHospitalBeds;
  return Math.trunc(availableBeds - severeCasesByRequestedTime);
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, totalHospitalBeds, region, timeToElapse, periodType
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const currentlyInfectedNrml = getCurrentlyinfectedN(reportedCases);
  const currentlyInfectedSvr = getCurrentlyinfectedS(reportedCases);
  const days = gettimeInDays(periodType, timeToElapse);
  const factor = getTimeFactor(periodType, timeToElapse);
  const infctdByRqstdTmN = getInfections(currentlyInfectedNrml, factor);
  const infctdByRqstdTmS = getInfections(currentlyInfectedSvr, factor);
  const hospitalBedsNrml = getHospitalBeds(totalHospitalBeds, getSevereCases(infctdByRqstdTmN));
  const hospitalBedsSvr = getHospitalBeds(totalHospitalBeds, getSevereCases(infctdByRqstdTmS));

  return {
    data,
    impact: {
      currentlyInfected: currentlyInfectedNrml,
      infectionsByRequestedTime: infctdByRqstdTmN,
      severeCasesByRequestedTime: getSevereCases(infctdByRqstdTmN),
      hospitalBedsByRequestedTime: hospitalBedsNrml,
      casesForICUByRequestedTime: getIcuCare(infctdByRqstdTmN),
      casesForVentilatorsByRequestedTime: getVentilators(infctdByRqstdTmN),
      dollarsInFlight: getDolarflight(infctdByRqstdTmN,
        avgDailyIncomePopulation, avgDailyIncomeInUSD,
        days)
    },
    severeImpact: {
      currentlyInfected: currentlyInfectedSvr,
      infectionsByRequestedTime: infctdByRqstdTmS,
      severeCasesByRequestedTime: getSevereCases(infctdByRqstdTmS),
      hospitalBedsByRequestedTime: hospitalBedsSvr,
      casesForICUByRequestedTime: getIcuCare(infctdByRqstdTmS),
      casesForVentilatorsByRequestedTime: getVentilators(infctdByRqstdTmS),
      dollarsInFlight: getDolarflight(infctdByRqstdTmS,
        avgDailyIncomePopulation, avgDailyIncomeInUSD,
        days)
    }
  };
};
  

  module.exports = {covid19ImpactEstimator}