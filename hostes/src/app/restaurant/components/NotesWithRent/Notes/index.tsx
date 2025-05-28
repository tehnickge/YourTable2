"use client";

import { TextField, Button, Paper, Typography, Grid, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  useAddRecordMutation,
  useLazyGetNoteByRestIdndDateQuery,
} from "@/redux/slice/restaurant/api";
import { DateTime } from "luxon";
import { useState } from "react";

export default function NotesPage() {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState<DateTime | null>(DateTime.now());
  const [restaurantId] = useState(1); // можно динамически подтягивать из стора

  const [addRecord] = useAddRecordMutation();
  const [fetchNotes, { data: notes }] = useLazyGetNoteByRestIdndDateQuery();

  const handleAdd = async () => {
    if (!date) return;
    const payload = {
      name,
      secondName,
      phoneNumber,
      comment,
      date: date.toISO()!, // .toISO() гарантирует string
      created: new Date().toISOString(),
      restaurantId,
    };
    await addRecord(payload);
    fetchNotes({ restaurantId, date: date.toISODate()! });
    setName("");
    setSecondName("");
    setPhoneNumber("");
    setComment("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Paper elevation={4} className="p-6">
            <Typography variant="h5" gutterBottom>
              Добавить заметку
            </Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Комментарий"
                  multiline
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <DatePicker
                  label="Дата"
                  value={date}
                  onChange={(newDate) => {
                    setDate(newDate);
                    if (newDate)
                      fetchNotes({ restaurantId, date: newDate.toISODate()! });
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={12} className="flex s-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                  fullWidth
                >
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {notes && notes.length > 0 && (
            <Paper elevation={2} className="p-6">
              <Typography variant="h6" gutterBottom>
                Заметки на {date?.toFormat("dd.MM.yyyy")}
              </Typography>
              <div className="space-y-4">
                {notes.map((note) => (
                  <Box
                    key={note._id}
                    className="border p-4 rounded-md bg-white shadow"
                  >
                    <Typography variant="subtitle1">
                      {note.name} {note.secondName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Телефон: {note.phoneNumber}
                    </Typography>
                    <Typography>{note.comment}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Время: {DateTime.fromISO(note.date).toFormat("HH:mm")}
                    </Typography>
                  </Box>
                ))}
              </div>
            </Paper>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
