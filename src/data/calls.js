export const getFerries = async () => {
  try {
    const ferries = await (
      await fetch(
        `https://qc.eapps.ncdot.gov/services/ferrytracker-service-test/TrackerData`
      )
    ).json();
    return ferries;
  } catch (error) {
    console.log(error);
  }
};
export const getIncidents = async () => {
  try {
    const incidents = await (
      await fetch(`https://tims.ncdot.gov/tims/api/incidents/`)
    ).json();
    return incidents;
  } catch (error) {
    console.log(error);
  }
};
