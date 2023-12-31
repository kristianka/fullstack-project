const AnnouncementBanner = () => {
    return (
        <div className="bg-gradient-to-r from-red-500 via-purple-400 to-blue-500">
            <div className="max-w-[90rem] px-4 py-4 sm:px-6 lg:px-8 mx-auto">
                <div className="flex justify-center md:grid-cols-1 text-center">
                    {/* <p className="text-xs text-white/[.8] uppercase tracking-wider">INFO</p> */}
                    <p className="mt-1 text-white font-medium">
                        Welcome! We are currently in beta and this site is not intended for
                        real-world usage. You can leave feedback{" "}
                        {
                            <a
                                href="https://github.com/kristianka/fullstack-project/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                here!
                            </a>
                        }
                    </p>
                    {/* <div className="mt-3 text-center md:text-left md:flex md:justify-end md:items-center">
                        <a
                            className="py-3 px-6 inline-flex justify-center items-center gap-2 rounded-full font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                            href="#"
                        >
                            I understand
                        </a>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
