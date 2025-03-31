<div className="bg-[#1e1e2f] text-white min-h-screen p-4">
  <h2 className="text-xl font-semibold mb-4">
    {editingId ? 'Editar Reserva' : 'Agregar Reserva'}
  </h2>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#2c2c3a] p-4 rounded-lg shadow">
    <div>
      <label className="block text-sm mb-1">Vehículo</label>
      <select
        name="vehiculo"
        value={formData.vehiculo || ''}
        onChange={handleInputChange}
        className="w-full bg-[#1e1e2f] border border-gray-600 rounded px-3 py-2 text-sm"
        required
      >
        <option value="">Seleccione...</option>
        <option value="Carro">Carro</option>
        <option value="Moto">Moto</option>
        <option value="Sin especificar">Sin especificar</option>
      </select>
    </div>
    {/* ...otros campos iguales con estilos similares */}
  </form>
</div>
