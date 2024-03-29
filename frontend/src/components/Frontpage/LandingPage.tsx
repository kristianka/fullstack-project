import { Link } from "react-router-dom";

const LandingPage = () => {
    document.title = "Notes";
    return (
        <div className="mt-auto grid min-h-full place-items-center">
            <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Notes
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Please sign in to use the application
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/login"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Sign in
                    </Link>
                    <Link to="/register" className="text-sm font-semibold text-gray-900">
                        Create account <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
