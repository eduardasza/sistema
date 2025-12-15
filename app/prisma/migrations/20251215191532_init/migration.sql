/*
  Warnings:

  - A unique constraint covering the columns `[espacoId,dataReserva,horaInicio,horaFim]` on the table `Reserva` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reserva_espacoId_dataReserva_horaInicio_horaFim_key" ON "Reserva"("espacoId", "dataReserva", "horaInicio", "horaFim");
