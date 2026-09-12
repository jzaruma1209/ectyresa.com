import api from "../lib/api";

const mediaService = {
  /**
   * Obtiene la lista de elementos multimedia subidos
   * @param {Object} params - { search: string }
   */
  getMedia: async (params = {}) => {
    const response = await api.get("/admin/media", { params });
    return response.data;
  },

  /**
   * Sube un único archivo de imagen a Cloudinary
   * @param {File} file
   * @param {Object} extraData - { nombre: string, seccion: string }
   */
  uploadSingle: async (file, extraData = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    if (extraData.nombre) formData.append("nombre", extraData.nombre);
    if (extraData.seccion) formData.append("seccion", extraData.seccion);

    const response = await api.post("/admin/media", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  },

  /**
   * Sube múltiples archivos de imagen a Cloudinary en lote
   * @param {File[]} files
   * @param {Object} extraData - { seccion: string }
   */
  uploadMultiple: async (files, extraData = {}) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    if (extraData.seccion) formData.append("seccion", extraData.seccion);

    const response = await api.post("/admin/media/multiple", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  },

  /**
   * Elimina un archivo de Cloudinary y de la base de datos
   * @param {number} id
   */
  deleteMedia: async (id) => {
    const response = await api.delete(`/admin/media/${id}`);
    return response.data;
  },
};

export default mediaService;
