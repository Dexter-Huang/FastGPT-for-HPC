const OnlineTuningPage = () => {
  return (
    <iframe
      src={`${process.env.TUNING_URL || 'http://10.20.28.28:7860'}`}
      style={{ width: '100%', height: '100%' }}
    ></iframe>
  );
};

export default OnlineTuningPage;
