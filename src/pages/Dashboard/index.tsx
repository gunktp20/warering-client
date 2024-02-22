import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BigNavbar, FormRow, NavLinks, SmallNavLink, FormControl } from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { GoCpu } from "react-icons/go";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material"

function Dashboard() {
    const dispatch = useAppDispatch();
    const axiosPrivate = useAxiosPrivate();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isMember, setIsMember] = useState<boolean>(true);
    const { user, token } = useAppSelector((state) => state.auth);

    const [values, setValues] = useState({
        search_dashboard: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const signOut = async () => {
        dispatch(logout());
        await axiosPrivate.post(
            `/auth/logout`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    };

    return (
        <Wrapper>
            <BigNavbar />
            <div className="flex">
                <NavLinks />
                <SmallNavLink
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setIsMember={setIsMember}
                    isMember={isMember}
                />
                <div className="m-[3rem] relative top-[4rem] w-[100%] h-fit flex flex-col sm:top-[5rem] bg-white shadow-md py-8 px-7 rounded-md">
                    <button
                        onClick={() => {
                            setIsDrawerOpen(true);
                        }}
                        className="hidden p-1 w-fit h-fit left-[0rem] absolute sm:block top-[-7rem] text-[#8f8f8f]"
                        id="small-open-sidebar-btn"
                    >
                        <RiMenu2Fill className="text-[23px]" />
                    </button>
                    <div className="absolute left-0 top-[-4rem] text-[23px] text-[#1d4469] font-bold">
                        Dashboard List
                    </div>
                    <div className="absolute top-[-4rem] text-[23px] text-[#1d4469] font-bold right-0">
                        <Button
                            onClick={() => {

                            }}
                            style={{
                                textTransform: "none",
                                width: "100%",
                                height: "39px",
                            }}
                            sx={{
                                border: 2,
                                fontWeight: "bold",
                                alignItems: "center",
                                fontSize: "12px",
                                color: "#1D4469",
                                ":hover": {

                                },
                                ":disabled": {
                                    color: "#fff",
                                }
                            }}
                            variant="outlined"

                            id="setup-user-submit"
                        >
                            Add Dashboard
                        </Button>
                    </div>
                    <div className=" w-[100%] justify-between flex items-center">
                        <div className="w-[330px] sm:w-[200px]">
                            <FormRow
                                type="text"
                                name="search_dashboard"
                                labelText="search dashboard"
                                value={values.search_dashboard}
                                handleChange={handleChange}
                                marginTop="mt-[0.2rem]"
                            />
                        </div>
                        <FormControl title="Sort by date" options={[
                            "Date"
                        ]} />
                    </div>

                    <table className="table rounded-xl overflow-hidden">
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Country</th>
                        </tr>
                        <tr>
                            <td>Alfreds Futterkiste</td>
                            <td>Maria Anders</td>
                            <td>Germany</td>
                        </tr>
                        <tr>
                            <td>Berglunds snabbköp</td>
                            <td>Christina Berglund</td>
                            <td>Sweden</td>
                        </tr>
                        <tr>
                            <td>Centro comercial Moctezuma</td>
                            <td>Francisco Chang</td>
                            <td>Mexico</td>
                        </tr>
                        <tr>
                            <td>Ernst Handel</td>
                            <td>Roland Mendel</td>
                            <td>Austria</td>
                        </tr>
                        <tr>
                            <td>Island Trading</td>
                            <td>Helen Bennett</td>
                            <td>UK</td>
                        </tr>
                        <tr>
                            <td>Königlich Essen</td>
                            <td>Philip Cramer</td>
                            <td>Germany</td>
                        </tr>
                        <tr>
                            <td>Laughing Bacchus Winecellars</td>
                            <td>Yoshi Tannamuri</td>
                            <td>Canada</td>
                        </tr>
                        <tr>
                            <td>Magazzini Alimentari Riuniti</td>
                            <td>Giovanni Rovelli</td>
                            <td>Italy</td>
                        </tr>
                        <tr>
                            <td>North/South</td>
                            <td>Simon Crowther</td>
                            <td>UK</td>
                        </tr>
                        <tr>
                            <td>Paris spécialités</td>
                            <td>Marie Bertrand</td>
                            <td>France</td>
                        </tr>
                    </table>
                </div>
            </div>
        </Wrapper>
    );
}

export default Dashboard;
