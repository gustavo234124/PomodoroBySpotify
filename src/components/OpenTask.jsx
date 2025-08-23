// components/OpenTask.jsx
import { useState } from "react";

export default function OpenTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón que abre el panel */}
      <button
        onClick={toggleModal}
        className="p-0 bg-gray-600 border-none hover:bg-green-700 rounded-full"
      >
        {/* SVG circular con checkbox */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
          viewBox="0 0 80 80"
        >
          <circle cx="40" cy="40" r="40" fill="#C1C1BD" fillOpacity="0.24" />
          <g fill="#FFFFFF">
            <rect x="20" y="22" width="6" height="6" rx="1" />
            <rect x="32" y="24" width="24" height="2" rx="1" />
            <rect x="20" y="34" width="6" height="6" rx="1" />
            <rect x="32" y="36" width="24" height="2" rx="1" />
            <rect x="20" y="46" width="6" height="6" rx="1" />
            <rect x="32" y="48" width="24" height="2" rx="1" />
          </g>
        </svg>
      </button>

      {/* Capa de fondo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleModal}
        />
      )}

      {/* Panel lateral */}
      <div
        className={`
          fixed top-0 right-0
          h-full w-80            /* ajusta ancho aquí */
          bg-white text-black p-6
          z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Cerrar */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-blue-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Tus tareas</h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-gray-900 font-medium">Pendientes</p>
            <span className="text-xl font-bold">{tasks.length}</span>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Terminadas</p>
            <span className="text-xl font-bold">
              {tasks.filter((t) => t.completed).length}
            </span>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Total</p>
            <span className="text-xl font-bold">{tasks.length}</span>
          </div>
        </div>
          <div
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl cursor-pointer"
            onClick={() => setShowTaskForm(true)}
          >
            {/* Icono SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>

            {/* Texto */}
            <span className="text-gray-800 text-base font-semibold">
              Agregar nueva tarea
            </span>
          </div>
   
        {/* ... contenido de tus tareas  renovacion hoala que sirva ya... */}
        {showTaskForm && (
          <div className="w-full max-w-sm mx-auto space-y-4 mt-4">
            {/* Input arriba */}
            <input
              type="text"
              placeholder="Nombre de tarea"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Botones en línea */}
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                  if (taskName.trim() !== "") {
                    setTasks((prev) => [...prev, { name: taskName.trim(), completed: false }]);
                    setTaskName("");
                    setShowTaskForm(false);
                  }
                }}
              >
                Agregar
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => setShowTaskForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {tasks.length > 0 && (
          <ul className="mt-6 space-y-2">
            {tasks.map((task, index) => (
              <>
                <li key={index} className="bg-gray-100 px-4 py-2 rounded shadow flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-full"
                      checked={task.completed}
                      onChange={() => {
                        const updatedTasks = [...tasks];
                        updatedTasks[index].completed = !updatedTasks[index].completed;
                        setTasks(updatedTasks);
                      }}
                    />
                    {editIndex === index ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1"
                        value={editedTaskName}
                        onChange={(e) => setEditedTaskName(e.target.value)}
                      />
                    ) : (
                      <span className={`${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updatedTasks = [...tasks];
                        updatedTasks.splice(index, 1);
                        setTasks(updatedTasks);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" >
                        <path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#F24822"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEditedTaskName(task.name);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M18 4.31943L14.121 0.440426C13.9819 0.300828 13.8166 0.190063 13.6347 0.114484C13.4527 0.0389052 13.2576 0 13.0605 0C12.8634 0 12.6683 0.0389052 12.4863 0.114484C12.3044 0.190063 12.1391 0.300828 12 0.440426L1.061 11.3794C0.768 11.6724 0.503 12.1064 0.311 12.5674C0.119 13.0304 0 13.5264 0 13.9404V18.4404H4.5C4.914 18.4404 5.408 18.3214 5.871 18.1294C6.334 17.9374 6.767 17.6724 7.06 17.3794L18 6.44043C18.1396 6.30134 18.2504 6.13607 18.3259 5.95409C18.4015 5.7721 18.4404 5.57698 18.4404 5.37993C18.4404 5.18287 18.4015 4.98775 18.3259 4.80577C18.2504 4.62378 18.1396 4.45851 18 4.31943ZM2.768 12.5014L11.061 4.20843L12.293 5.44043L4 13.7334L2.768 12.5014ZM4.5 16.4404H3L2 15.4404V13.9404C2 13.8634 2.033 13.6354 2.158 13.3354C2.168 13.3154 5.125 16.2734 5.125 16.2734C4.803 16.4074 4.577 16.4404 4.5 16.4404ZM5.939 15.6724L4.707 14.4404L13 6.14743L14.232 7.37943L5.939 15.6724ZM14.939 6.67243L11.767 3.50043L13.06 2.20743L16.23 5.37943L14.939 6.67243Z" fill="#0D99FF"/>
                      </svg>
                    </button>
                  </div>
                </li>
                {editIndex === index && (
                  <div className="flex gap-2 mt-2 ml-7">
                    <button
                      onClick={() => {
                        const updatedTasks = [...tasks];
                        updatedTasks[index].name = editedTaskName.trim();
                        setTasks(updatedTasks);
                        setEditIndex(null);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-green-200"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditIndex(null);
                        setEditedTaskName("");
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
