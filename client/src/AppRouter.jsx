import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './App';
import Profile from './components/Auth';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/profile" component={Profile} />        
      </Switch>
    </Router>
  );
}

export default AppRouter;
