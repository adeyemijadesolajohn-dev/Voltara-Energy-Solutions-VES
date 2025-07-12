const Unauthorized = () => (
  <div className="unauth-page">
    <h1>403 - Unauthorized</h1>
    <p>You do not have access to this page.</p>
    <Link to="/SelectDashboard">Return to Dashboard</Link>
  </div>
);

export default Unauthorized;
