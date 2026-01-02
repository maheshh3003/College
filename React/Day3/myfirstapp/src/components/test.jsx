import React from "react";
import logo from '../logo.svg';


function Test() {
    return (
        <React.Fragment>
            <div>
                <div> <img src={logo} alt="logo" height="10px" /></div>
                <div class="grid grid-cols-2 sm:grid-cols-3{@media (width >= 40rem){ grid-template-columns: repeat(3, minmax(0, 1fr));}}">
                    <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                        <span>
                            username :
                            <input type="text" placeholder="Username" />
                        </span>
                    </div>
                    <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                        <span>
                            password :
                            <input type="password" placeholder="password" />
                        </span>
                    </div>
                    <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                        <span>
                            <button class="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 ... ">Submit</button>
                        </span>
                    </div>
                </div>

            </div>

        </React.Fragment>
    );
}

export default Test;