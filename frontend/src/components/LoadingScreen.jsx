export const LoadingScreen = ({ label = 'Please wait...' }) => (
  <div className="loading-screen">
    <div className="loading-screen__dot" />
    <p>{label}</p>
  </div>
);
