import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputAdornment,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import { taskApi, categoryApi } from './api';

const PRIORITY_LABELS = { HIGH: '高', MEDIUM: '中', LOW: '低' };
const PRIORITY_COLORS = { HIGH: 'error', MEDIUM: 'warning', LOW: 'success' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [categoryId, setCategoryId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const loadTasks = useCallback(async () => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (sortByPriority) params.sortBy = 'priority';
    const data = await taskApi.getAll(params);
    setTasks(data);
  }, [keyword, sortByPriority]);

  const loadCategories = async () => {
    const data = await categoryApi.getAll();
    setCategories(data);
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await taskApi.create({
      title: title.trim(),
      priority,
      categoryId: categoryId || null,
    });
    setTitle('');
    setPriority('MEDIUM');
    setCategoryId('');
    loadTasks();
  };

  const handleToggle = async (id) => {
    await taskApi.toggle(id);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await taskApi.remove(id);
    loadTasks();
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await categoryApi.create(newCatName.trim());
    setNewCatName('');
    setCatDialogOpen(false);
    loadCategories();
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        TODO リスト
      </Typography>

      {/* Search & Sort */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="タスク名・カテゴリで検索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant={sortByPriority ? 'contained' : 'outlined'}
            startIcon={<SortIcon />}
            onClick={() => setSortByPriority(!sortByPriority)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            優先度順
          </Button>
        </Stack>
      </Paper>

      {/* Add Task Form */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box component="form" onSubmit={handleAddTask}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="新しいタスク"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Stack direction="row" spacing={1}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>優先度</InputLabel>
                <Select
                  value={priority}
                  label="優先度"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="HIGH">高</MenuItem>
                  <MenuItem value="MEDIUM">中</MenuItem>
                  <MenuItem value="LOW">低</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>カテゴリ</InputLabel>
                <Select
                  value={categoryId}
                  label="カテゴリ"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <MenuItem value="">なし</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setCatDialogOpen(true)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                <AddIcon fontSize="small" />
                カテゴリ追加
              </Button>
            </Stack>
            <Button type="submit" variant="contained" fullWidth>
              タスクを追加
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Task List */}
      <Paper>
        <List>
          {tasks.length === 0 && (
            <ListItem>
              <ListItemText
                primary="タスクがありません"
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
          {tasks.map((task, idx) => (
            <Box key={task.id}>
              {idx > 0 && <Divider />}
              <ListItem>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                />
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.disabled' : 'text.primary',
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={PRIORITY_LABELS[task.priority]}
                        color={PRIORITY_COLORS[task.priority]}
                        size="small"
                      />
                      {task.category && (
                        <Chip label={task.category.name} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)}>
        <DialogTitle>カテゴリを追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="カテゴリ名"
            fullWidth
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCatDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleAddCategory} variant="contained">
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
