import React from "react";
const Profile_img = ({ formData, setFormData}) => {
  const uploadImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      // if (e.target.files[0].size > 8e6) {
      //   window.alert("Please upload a file smaller than 8 MB");
      //   return false;
      // }
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e) => {
        let image_url=e.target.result
        let image=document.createElement("img")
        image.src=image_url
        image.onload=(e)=>{
          let canvas=document.createElement("canvas")
          let ratio=500/e.target.width
          canvas.width=500
          canvas.height=e.target.height * ratio
          const context=canvas.getContext("2d")
          context.drawImage(image,0,0,canvas.width,canvas.height)
          let new_image_url=context.canvas.toDataURL("image/jpeg",100)
          setFormData({
            ...formData,
            profile: { ...formData.profile, profile_img: new_image_url},
          });
        }
      };
    }
  };
  return (
    <div>
      {formData.profile.profile_img ? (
        <img
          className="object-cover rounded-lg object-top w-32 h-32"
          src={formData.profile.profile_img}
          alt="Profile Image"
        />
      ) : (
        <img
          className="object-cover rounded-lg w-32 h-32"
          src="/src/assets/profile_img.jpg"
          alt="Profile Image"
        />
      )}
      <label
        htmlFor="input_file"
        className="inline-flex justify-center w-32 py-2.5 mt-2 sm:mt-4 text-sm font-medium text-white bg-gray-900 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-700"
      >
        Change Image
      </label>
      <input
        type="file"
        accept="image/jpeg, img/png, image/jpg"
        id="input_file"
        className="hidden"
        onChange={uploadImage}
      />
    </div>
  );
};

export default Profile_img;
