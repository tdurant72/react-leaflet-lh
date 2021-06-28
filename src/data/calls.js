export const getFerries = async () => {
  try {
    const ferries = await (
      await fetch(
        `https://qc.eapps.ncdot.gov/services/ferrytrackerservice-dev/TrackerData`
      )
    ).json();
    return ferries;
  } catch (error) {
    console.log(error);
  }
};
