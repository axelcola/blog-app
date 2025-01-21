'use client'
import { useState, useEffect } from 'react'
import { Post, User } from '@prisma/client'
import { 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent,
  Box
} from '@mui/material'

type PostWithUser = Post & {
  user: User
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
      setError(null)
    } catch (err) {
      setError(`Failed to load posts. Please try again. ${err}`)
    }
  }

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(posts.filter(post => post.id !== postId))
      setIsDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (err) {
      setError(`Failed to delete post. Please try again. ${err}`)
    }
  }

  const handleUserChange = (event: SelectChangeEvent) => {
    setSelectedUserId(event.target.value)
  }

  const filteredPosts = selectedUserId 
    ? posts.filter(post => post.userId === parseInt(selectedUserId))
    : posts

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <Select
            value={selectedUserId}
            onChange={handleUserChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>All Users</em>
            </MenuItem>
            {Array.from(new Set(posts.map(post => post.userId))).map(userId => (
              <MenuItem key={userId} value={userId}>
                User {userId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredPosts.map(post => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.body}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  By User {post.userId}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setPostToDelete(post)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => postToDelete && handleDelete(postToDelete.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}