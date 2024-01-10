const OnlineDataSetMakerPage = () => {
  return (
    <iframe
      src={`${process.env.ONLINE_DATASETMAKER_URL || 'http://10.20.28.28:2323'}`}
      style={{ width: '100%', height: '100%' }}
    ></iframe>
  );
};

export default OnlineDataSetMakerPage;
