"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { usePageNavigationLoader } from "@/context/PageNavigationLoaderContext";
import Logo from "@/components/Logo";
// import SearchBar from "./SearchBar";

import { useLogout } from "@/utils/logout";
import LogoutConfirmation from "@/utils/LogoutConfirmation";
import { useAccessControl } from "@/hooks/useAccessControl";

const SideMenu = () => {
  const { canCustom: canHideCRMMAster } = useAccessControl("w_customer_master");
  const { canCustom: canHideSaleNote } = useAccessControl("w_counter_sale");
  const { canCustom: canHideURDNote } = useAccessControl("w_counter_purchase");
  const { canCustom: canHideOrderNote } = useAccessControl("w_counter_order");
  const { canCustom: canHideClosingStockNote } =
    useAccessControl("w_counter_stock");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // State to control Avatar
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log("Logout modal open state:", isLogoutModalOpen);
  }, [isLogoutModalOpen]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  // const router = useRouter();
  const pathname = usePathname();
  const { userData } = useUser(); // 👈 use context to use active user info
  const { setIsPageLoading } = usePageNavigationLoader(); // Consume the loader context
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  const lastScrollY = useRef(0);

  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
      setIsScrollingUp(false);
    } else {
      setIsScrollingUp(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [controlNavbar]);

  // Function to toggle avatar
  const handleClickAvatar = () => {
    setIsAvatarClicked(!isAvatarClicked);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-avatar-toggle]")
      ) {
        setIsAvatarClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isAvatarClicked]);

  // Data Visualization Menu
  // const [isOpen, setIsOpen] = useState(false);
  // const handleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  const { logout } = useLogout();

  //  const onConfirm = async () => {
  //   console.log("✅ onConfirm triggered");
  //   setIsPageLoading(true);
  //   setIsAvatarClicked(false);

  //   try {
  //     await logout(); // This must have router.push() or clear session
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     alert("Something went wrong. Please try again.");
  //     setIsPageLoading(false);
  //   }
  // };
  const handleLogout = async () => {
    console.log("✅ onConfirm triggered");
    setIsPageLoading(true);
    setIsAvatarClicked(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong. Please try again.");
      setIsPageLoading(false);
    }
  };
  // Helper function to handle navigation and show loader
  const handleNavigation = (targetPath: string) => {
    if (pathname !== targetPath) {
      // Only show loader if navigating to a different page
      setIsPageLoading(true);
    }
    if (isSidebarOpen && window.innerWidth < 1024) {
      // Close sidebar on mobile/tablet after click
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full bg-white text-slate-700 border-b border-slate-200 shadow-sm font-[var(--font-poppins)] transition-transform duration-300 ${
          isScrollingUp ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-4 py-3 lg:px-6">
          {" "}
          {/* Adjusted padding for a bit more space */}
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              {/* Hamburger Menu */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>

              <Link
                href="/"
                className="hidden md:flex items-center ml-1 lg:ml-2 md:ml-2 ms-2 lg:me-24" // Added items-center for vertical alignment
              >
                <Logo />
              </Link>
            </div>
            {/* <div>
              {" "}
              <SearchBar />
            </div> */}

            <div
              className="flex items-center cursor-pointer"
              ref={avatarRef}
              onClick={handleClickAvatar}
            >
              <div className="relative flex items-center ms-3">
                {/* Avatar button */}
                <div className="flex gap-x-3 justify-center items-center">
                  {/* Avatar Icon */}
                  <span className="sm:block hidden text-lg font-medium text-black">
                    Hi, {userData?.username}
                  </span>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <span className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                      {" "}
                      {/* Added overflow-hidden and a subtle bg */}
                      <Image
                        width={300}
                        height={250}
                        src={"/profile.png"}
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                        alt={userData?.username || "User"} // More descriptive alt text
                      />
                    </span>
                  </button>

                  {/* User name */}

                  {/* Caret (v) icon  */}
                  {/* <button className="text-white font-bold">
                    <RxCaretDown className="font-bold text-xl text-black" />
                  </button> */}
                </div>

                {/* Avatar settings options */}
                {isAvatarClicked && (
                  <div
                    className="absolute top-full right-0 mt-2 z-50 w-56 text-base list-none bg-white divide-y divide-slate-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5" // Enhanced dropdown styling
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm font-bold text-indigo-700 tracking-wider border-b border-slate-300 pb-1 mb-1"
                        role="none"
                      >
                        {userData?.counter_name?.toLocaleUpperCase()}
                      </p>
                      <p
                        className="text-sm font-semibold text-black truncate"
                        role="none" // Consider text-slate-700 for consistency
                      >
                        ACTIVE YEAR :{" "}
                        <span className="text-sm font-semibold text-indigo-600">
                          {userData?.yearname}
                        </span>
                      </p>
                    </div>
                    {/* hr is implicitly handled by divide-y styling on parent */}
                    <ul className="py-1" role="none">
                      <li>
                        <Link
                          href="/customerprofiles"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-md"
                          role="menuitem" // Added hover accent
                          onClick={() => {
                            handleNavigation("/customerprofiles");
                            setIsAvatarClicked(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5 me-2" // Changed ms-auto to me-2 for margin-end
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                          </svg>
                          Home
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-md"
                          role="menuitem" // Added hover accent
                          onClick={() => {
                            // handleNavigation("/settings"); // If settings is a separate page
                            setIsAvatarClicked(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5 me-2" /* Adjust size and margin as needed */
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24" /* Note the viewBox might be different from your current one */
                          >
                            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                          </svg>
                          Settings
                        </Link>
                      </li>
                      <li>
                        <div
                          className="flex w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-100 hover:text-red-700 rounded-md"
                          onClick={() => {
                            setIsLogoutModalOpen(true);
                          }}
                        >
                          <svg
                            className="w-5 h-5 me-2" /* Adjust size/margin as needed */
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                          </svg>
                          Sign out
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 text-black bg-white transition-transform shadow-md ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-3 pb-4 overflow-y-auto overflow-auto no-scrollbar">
          <ul className="space-y-2 font-medium ">
            {/* data visualization Dashboard */}
            {/* <li>
              <button
                type="button"
                onClick={handleDropdown}
                className={`flex items-center w-full p-2 text-base transition duration-75 rounded-lg group ${
                  pathname.startsWith("/datavisualization")
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
                aria-controls="dropdown-example"
                aria-expanded={isOpen}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75" 
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 20h18v2H3v-2zm4.5-8h2v5h-2v-5zm5-4h2v9h-2V8zm5 2h2v7h-2v-7zM4 16h2v2H4v-2zm15-1h2v4h-2v-4zM7.5 9h2v2h-2V9zm7.5-4h2v2h-2V5z" />
                </svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-[var(--font-spaceGrotesk)]">
                  {" "}
                
                  Data Visualization
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-example"
                className={`text-xs space-y-2 ${isOpen ? "block" : "hidden"}`}
              >
                <li>
                  <Link
                    onClick={() =>
                      handleNavigation(
                        "/datavisualization/amountvstime-type-branch"
                      )
                    }
                    href="/datavisualization/amountvstime-type-branch"
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group ${
                      pathname === "/datavisualization/amountvstime-type-branch"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5 transition duration-75" 
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c.6 0 1 .4 1 1v1.2c1.5.4 2.7 1.5 3.5 2.8.3.6-.2 1.3-.8 1.3h-7.4c-.6 0-1.1-.7-.8-1.3C8.3 5.7 9.5 4.6 11 4.2V3c0-.6.4-1 1-1zm0 20c-4.4 0-8-3.6-8-8 0-2.3 1-4.5 2.8-6 .2-.2.5-.2.7-.1 1.3.4 2.8.5 4.5.5s3.2-.1 4.5-.5c.3-.1.5-.1.7.1 1.8 1.5 2.8 3.7 2.8 6 0 4.4-3.6 8-8 8zm0-10.2c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3c-.4 0-.8-.2-1-.5-.3-.5-1-.7-1.5-.4s-.7 1-.4 1.5c.5.8 1.4 1.3 2.5 1.3 1.9 0 3.3-1.5 3.3-3.3 0-1.5-1.1-2.7-2.5-3-.1-.5-.6-.9-1.1-.9z" />
                    </svg>

                    <span className="ms-3">Amount Wise</span>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() =>
                      handleNavigation(
                        "/datavisualization/weightvstime-counter-rate-date-branch"
                      )
                    }
                    href="/datavisualization/weightvstime-counter-rate-date-branch"
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group ${
                      pathname ===
                      "/datavisualization/weightvstime-counter-rate-date-branch"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c.6 0 1 .4 1 1v1h4.5c.6 0 1 .4 1 1s-.4 1-1 1h-.8l2.9 7.7c.1.3.1.6-.1.8-.1.2-.4.4-.7.4h-4c-.3 0-.6-.2-.7-.4-.2-.2-.2-.5-.1-.8l2.9-7.7H12v12h2c.6 0 1 .4 1 1s-.4 1-1 1H10c-.6 0-1-.4-1-1s.4-1 1-1h2V6H7.5l2.9 7.7c.1.3.1.6-.1.8-.1.2-.4.4-.7.4H5.6c-.3 0-.6-.2-.7-.4-.2-.2-.2-.5-.1-.8L7.7 6H7c-.6 0-1-.4-1-1s.4-1 1-1H12V3c0-.6.4-1 1-1zm-6 16c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm12 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
                    </svg>

                    <span className="ms-3 ">Weight Wise</span>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() =>
                      handleNavigation("/datavisualization/days-salesman-wise")
                    }
                    href="/datavisualization/days-salesman-wise"
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group ${
                      pathname === "/datavisualization/days-salesman-wise"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-6 h-6 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                     
                      <path d="M12 2c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 8c-3.3 0-7 1.7-7 5v4c0 1.1.9 2 2 2h4v-6H7v-1c0-1.7 3.6-3 5-3s5 1.3 5 3v1h-4v6h4c1.1 0 2-.9 2-2v-4c0-3.3-3.7-5-7-5zM19 12h-1v-1c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v1h-1c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-6c0-.6-.4-1-1-1zm-4 0v-1h2v1h-2zm4 7h-6v-4h6v4z" />
                    </svg>

                    <span className="ms-3">Day & Salesman Wise</span>
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* Customer Profiles */}
            {canHideCRMMAster("Customer Master") && (
              <li>
                <Link
                  href="/customerprofiles"
                  onClick={() => handleNavigation("/customerprofiles")}
                  className={`flex items-center p-2 rounded-lg group ${
                    pathname === "/customerprofiles"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75" // Removed text-black
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                  </svg>

                  <span className="ms-3">Customer Profiles</span>
                </Link>
              </li>
            )}
            {/* Image - Upload */}
            <li>
              <Link
                href="/image-upload"
                onClick={() => handleNavigation("/image-upload")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/image-upload"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75" // Removed text-black
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 20a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5zm0-2h14V5H5v13z" />
                  <path d="M15.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM7 16l2.5-3 1.5 2 2-3 3.5 4.5H7z" />
                  <path d="M12 2a1 1 0 0 1 1 1v3h2.586l-3.293-3.293a1 1 0 0 1 0-1.414l3.293-3.293H13V1a1 1 0 1 1-2 0v3h-2.586l3.293 3.293a1 1 0 0 1 0 1.414L8.414 2H11V1a1 1 0 0 1 1-1z" />
                </svg>
                <span className="ms-3">Image Upload</span>
              </Link>
            </li>
            {/* Sales Note */}
            {canHideSaleNote("Counter Delivery Note") && (
              <li>
                <Link
                  href="/sales"
                  onClick={() => handleNavigation("/sales")}
                  className={`flex items-center p-2 rounded-lg group ${
                    pathname === "/sales"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75" // Removed text-black
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.414a2 2 0 0 0-.586-1.414l-4.414-4.414A2 2 0 0 0 13.586 2H6zm12 18H6V4h7v4a1 1 0 0 0 1 1h4v11z" />
                    <path d="M8 14h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm0-4h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Sales Note
                  </span>
                </Link>
              </li>
            )}
            {/* URD Note */}
            {canHideURDNote("Counter U.R.D. Purchase Note") && (
              <li>
                <Link
                  href="/urd"
                  onClick={() => handleNavigation("/urd")}
                  className={`flex items-center p-2 rounded-lg group ${
                    pathname === "/urd"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75" // Removed text-black
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8.414a1 1 0 0 0-.293-.707l-4.414-4.414A1 1 0 0 0 14.586 3H5zm13 18H6V4h8v4a1 1 0 0 0 1 1h4v11z" />
                    <path d="M9 12h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm0 4h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2z" />
                    <circle cx="12" cy="7" r="1" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    URD Note
                  </span>
                </Link>
              </li>
            )}
            {/* Order Window */}
            {canHideOrderNote("Counter Order Delivery Note") && (
              <li>
                <Link
                  href="/order"
                  onClick={() => handleNavigation("/order")}
                  className={`flex items-center p-2 rounded-lg group ${
                    pathname === "/order"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75" // Removed text-black
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.414a1 1 0 0 0-.293-.707L13.293 2.293A1 1 0 0 0 12.586 2H6zm12 18H7V4h5v4a1 1 0 0 0 1 1h5v11z" />
                    <path d="M9 11h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm0 4h4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm5.707-7.707a1 1 0 0 1-1.414 0L12 7.414l-1.293 1.293a1 1 0 0 1-1.414-1.414l2-2a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414z" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Order Note
                  </span>
                </Link>
              </li>
            )}

            {/* Closing Stock */}
            {canHideClosingStockNote("Closing Stock") && (
              <li>
                <Link
                  href="/closing-stock"
                  onClick={() => handleNavigation("/closing-stock")}
                  className={`flex items-center p-2 rounded-lg group ${
                    pathname === "/closing-stock"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Icon for Closing Stock (Inventory/Box) */}
                    <path d="M21 6h-4V4c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zm8 15H3V8h18v11zM9 12h6v2H9z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Closing Stock
                  </span>
                </Link>
              </li>
            )}
            {/* <li>
              <Link
                href="/product-list"
                onClick={() => handleNavigation("/product-list")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/product-list"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                // {/* SVG Icon for Product List would be here */}
            {/* <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75" // Example classes, icon might differ
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24" // Example viewBox
                >
                  // {/* Example path for a list icon, actual icon might vary */}
            {/* <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Product List
                </span>
              </Link>
            </li>  */}
            {/* Rate Master */}
            {/* <li>
              <Link
                href="/rate-master"
                onClick={() => handleNavigation("/rate-master")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/rate-master"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                 
                  <path d="M21.41 11.59l-9-9C12.05 2.24 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.24 1.05.59 1.41l9 9c.36.36.86.59 1.41.59s1.05-.23 1.41-.59l7-7c.36-.36.59-.86.59-1.41s-.23-1.05-.59-1.41zM13 20.01L4 11V4h7l9 9-7 7.01zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Rate Master
                </span>
              </Link>
            </li> */}

            {/* cash book summary*/}
            {/* <li>
              <Link
                href="/counter-stock-transfer"
                onClick={() => handleNavigation("/counter-stock-transfer")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/counter-stock-transfer"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                 
                  <path d="M21.41 11.59l-9-9C12.05 2.24 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.24 1.05.59 1.41l9 9c.36.36.86.59 1.41.59s1.05-.23 1.41-.59l7-7c.36-.36.59-.86.59-1.41s-.23-1.05-.59-1.41zM13 20.01L4 11V4h7l9 9-7 7.01zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Counter Stock Transfer
                </span>
              </Link>
            </li> */}
            {/* <li>
              <Link
                href="/cash-book-summary"
                onClick={() => handleNavigation("/cash-book-summary")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/cash-book-summary"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 8h-3V4H7v4H4l8 8 8-8zM4 18h16v2H4z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Cash Book Summary
                </span>
              </Link>
            </li> */}
            {/* General Ledger */}
            {/* <li>
              <Link
                href="/general-ledger"
                onClick={() => handleNavigation("/general-ledger")}
                className={`flex items-center p-2 rounded-lg group ${
                  pathname === "/general-ledger"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                 
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l4 4 4-4h-2.5V11h-3v4.01H8z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  General Ledger
                </span>
              </Link>
            </li> */}
          </ul>
        </div>
      </aside>

      {/* Add LogoutConfirmation modal rendering */}
      <LogoutConfirmation
        open={isLogoutModalOpen}
        onConfirm={async () => {
          setIsLogoutModalOpen(false);
          await handleLogout();
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default SideMenu;
