import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch plants from the backend
  useEffect(() => {
    fetch("http://localhost:7000/api/plants")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  // Navigate to Add Plant
  const handleAddPlant = () => {
    navigate("/admin/plants/add-plant");
  };

  // Navigate to Update Plant
  const handleUpdatePlant = (id) => {
    navigate(`/admin/plants/update/${id}`);
  };

  // Delete a plant
  const handleDeletePlant = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:7000/api/delete/plant/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPlants(plants.filter((plant) => plant._id !== id));
        } else {
          console.error("Failed to delete plant");
        }
      } catch (error) {
        console.error("Error deleting plant:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Generate PDF Report
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text("Plant Report", 14, 16);

    const tableColumn = [
      "Name", "Scientific Name", "Type", "Category", "Description",
      "Watering", "Temp", "Light", "Qty", "Price", "Origin"
    ];

    const tableRows = plants.map((plant) => [
      plant.plantname,
      plant.sciencename,
      plant.planttype,
      plant.plantcategory,
      plant.description,
      plant.wateringfeq,
      plant.temp,
      plant.light,
      plant.avalquaantity,
      plant.priceunit,
      plant.origin
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save("Plant_Report.pdf");
  };

  // Filter plants by search term
  const filteredPlants = plants.filter((plant) =>
    plant.plantname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            onClick={handleAddPlant}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors border border-green-700"
          >
            Add New Plant
          </button>
          <button
            onClick={handleGenerateReport}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors border border-blue-700"
          >
            Generate Report (PDF)
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Plant Name"
          className="px-4 py-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Plant Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Plant Name</th>
              <th className="border border-gray-300 px-4 py-2">Scientific Name</th>
              <th className="border border-gray-300 px-4 py-2">Plant Type</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-12 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Watering Frequency</th>
              <th className="border border-gray-300 px-4 py-2">Temperature</th>
              <th className="border border-gray-300 px-4 py-2">Light</th>
              <th className="border border-gray-300 px-4 py-2">Available Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Origin</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlants.map((plant) => (
              <tr key={plant._id}>
                <td className="border border-gray-300 px-4 py-2">{plant.plantname}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.sciencename}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.planttype}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.plantcategory}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.description}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.wateringfeq}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.temp}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.light}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.avalquaantity}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.priceunit}</td>
                <td className="border border-gray-300 px-4 py-2">{plant.origin}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdatePlant(plant._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeletePlant(plant._id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantManagement;