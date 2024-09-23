import React from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import { deleteDoc, doc, setDoc} from "firebase/firestore";
import { db } from "../../../firestore";

import dayjs from "dayjs";
const TodayCases = ({ data, selectedDate }) => {
  let records = data.filter((f) =>
    f.date.includes(dayjs(selectedDate).format("DD-MMM-YYYY"))
  );
  let username = localStorage.getItem("username");
  const handleStatus = async (id) => {
    let selected = records.find((f) => f.id === id);
    console.log(selected);
    if (selected.status === "open") {
      selected.status = "closed";
    } else if (selected.status === "closed") {
      selected.status = "open";
    }
    try {
      await setDoc(doc(db, "cases", id), { ...selected });
      location.reload();
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = async(id) => {
    const confirm = window.confirm("Click OK to Delete");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "cases", id));
        location.reload();
      } catch (error) {
        console.log(error)
      }
    }
  };
  return (
    <div>
      <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4">
        <div className="overflow-x-auto">
          {records.length === 0 ? (
            <div className="flex justify-center my-6 font-semibold">
              <span>No Case Found</span>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Case Detail
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Court Detail
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date Time
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 flex items-center justify-end"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((d, i) => (
                  <tr key={i} className="border-b  border-gray-300 align-top">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {d.client_name}
                      <span className="pl-1 text-gray-500 font-normal">
                        {d.client_role}
                      </span>
                      <div className="font-normal text-gray-500">
                        <p>{d.client_email}</p>
                        <p>
                          Case no:{" "}
                          <span className="font-medium">{d.case_number}</span>
                        </p>
                        <p>
                          Case type :{" "}
                          <span className="font-medium">{d.case_type}</span>
                        </p>
                      </div>
                    </th>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-normal text-gray-500">
                        <p>
                          Court:{" "}
                          <span className="font-medium">{d.court_branch}</span>
                        </p>
                        <p>
                          Court no :{" "}
                          <span className="font-medium">{d.court_number}</span>
                        </p>
                        <p>
                          Judge:{" "}
                          <span className="font-medium">{d.judge_name}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p>{d.date}</p>
                      <p>{d.time}</p>
                    </td>
                    <td
                      className="px-4 py-3 cursor-pointer whitespace-nowrap"
                      onClick={() => handleStatus(d.id)}
                    >
                      {d.status} <RiExpandUpDownFill className="inline" />
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end space-x-3 whitespace-nowrap">
                      <Link to={`/Lawyer/${username}/View_Case/${d.id}`}>
                        <button>
                          <FaRegEye size={16} className="hover:text-blue-600" />
                        </button>
                      </Link>
                      <Link to={`/Lawyer/${username}/Edit_Case/${d.id}`}>
                        <button>
                          <FaRegEdit
                            size={16}
                            className="hover:text-green-600"
                          />
                        </button>
                      </Link>
                      <Link>
                        <button onClick={() => handleDelete(d.id)}>
                          <FaRegTrashAlt
                            size={16}
                            className="hover:text-red-600"
                          />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default TodayCases;
