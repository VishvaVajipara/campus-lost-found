import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseItems from './pages/BrowseItems';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import MyReports from './pages/MyReports';
import EditItem from './pages/EditItem';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages that need login: ProtectedRoute checks before showing them */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<BrowseItems />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="/report/lost" element={<ReportItem type="lost" />} />
          <Route path="/report/found" element={<ReportItem type="found" />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
