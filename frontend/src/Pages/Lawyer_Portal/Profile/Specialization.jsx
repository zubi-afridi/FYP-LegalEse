import React from "react";
import Specialization_List from "../../../Array_json_Files/Specialization_List.json";
const Specialization = ({formData,setFormData}) => {
    const handleCheckboxChange = async (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          if (formData.profile.specialization.length >= 4) {
            e.target.checked = false;
            return;
          }
          setFormData({ ...formData, profile: { ...formData.profile,specialization:[...formData.profile.specialization,value]}})
        } else {
          setFormData({...formData,profile:{...formData.profile,specialization:(formData.profile.specialization.filter((item) => item !== value))}})
        }
      };
  return (
    <div>
      <label
        htmlFor=" specialization"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        Specialization
      </label>
      <label className="block mb-2 text-sm text-gray-400 dark:text-white">
        You can select maximum 4 tags
      </label>
      <div className="grid sm:grid-cols-3 gap-2">
        {Specialization_List.map((specialization) => (
          <div key={specialization.id}>
            <input
              id={specialization.id}
              type="checkbox"
              name="specializations"
              value={specialization.label}
              checked={formData.profile.specialization.includes(
                specialization.label
              )}
              className="w-3 h-3 border-gray-400 cursor-pointer"
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={specialization.id}
              className="text-sm pl-2 text-gray-900 cursor-pointer"
            >
              {specialization.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specialization;
