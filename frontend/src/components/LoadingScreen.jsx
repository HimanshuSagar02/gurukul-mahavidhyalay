export const LoadingScreen = ({ label = 'Loading...' }) => (
  <div className="loading-screen">
    <div className="loading-screen__dot" />
    <p>{label}</p>
  </div>
);
