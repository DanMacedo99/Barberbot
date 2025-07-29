import Navbar from '../components/Navbar';

function PainelLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="app-container">
                {children}
            </div>
        </>
    );
}

export default PainelLayout;