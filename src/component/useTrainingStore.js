import { create } from 'zustand'
import axios from 'axios'
import toast from "react-hot-toast";

const BASE_URL = "https://isinrimuseum-serverside.onrender.com"
//const BASE_URL = "http://localhost:3000"

const useTrainingStore = create((set, get) => ({
  // State
  loading: false,
  error: null,
  registration: null,
  userExists: false,
  stats: null,
  
  // Form data state
  formData: {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    country_of_origin: '',
    state_of_origin: '',
    local_government_area: '',
    address: '',
    highest_level_of_education: '',
    field_of_study: '',
    institution_name: '',
    graduation_year: '',
    employment_status: '',
    years_of_experience: '',
    job_title: '',
    company_name: '',
    preferred_training_track: '',
    training_mode: '',
    preferred_start_date: '',
    training_duration_preference: '',
    programming_languages: [],
    frameworks_and_technologies: []
  },

  // Actions
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  resetFormData: () => set({
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      country_of_origin: '',
      state_of_origin: '',
      local_government_area: '',
      address: '',
      highest_level_of_education: '',
      field_of_study: '',
      institution_name: '',
      graduation_year: '',
      employment_status: '',
      years_of_experience: '',
      job_title: '',
      company_name: '',
      preferred_training_track: '',
      training_mode: '',
      preferred_start_date: '',
      training_duration_preference: '',
      programming_languages: [],
      frameworks_and_technologies: []
    }
  }),

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Register trainee
  registerTrainee: async (formData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await axios.post(`${BASE_URL}/api/training/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        set({ 
          registration: response.data.registration,
          loading: false 
        });
        
        toast.success(response.data.message || 'Registration completed successfully!');
        
        // Reset form data after successful registration
        get().resetFormData();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  },

  // Check if user exists
  checkUserExists: async (email) => {
    set({ loading: true, error: null });
    
    try {
      const response = await axios.post(`${BASE_URL}/api/training/check-user`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        set({ 
          userExists: response.data.exists,
          loading: false 
        });

        if (response.data.exists) {
          toast.error(`User with email ${email} already exists!`);
          return { 
            success: true, 
            exists: true, 
            user: response.data.user 
          };
        } else {
          return { 
            success: true, 
            exists: false 
          };
        }
      } else {
        throw new Error(response.data.message || 'Failed to check user');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to check user existence';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  },

  // Get registration statistics
  getRegistrationStats: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await axios.get(`${BASE_URL}/api/training/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        set({ 
          stats: {
            general: response.data.stats,
            trainingTracks: response.data.training_tracks
          },
          loading: false 
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch registration statistics';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  },

  // Utility functions
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhoneNumber: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  validateFormData: (data) => {
    const requiredFields = [
      'first_name',
      'last_name', 
      'email',
      'phone_number',
      'country_of_origin',
      'state_of_origin',
      'local_government_area',
      'address',
      'highest_level_of_education',
      'employment_status',
      'preferred_training_track',
      'training_mode'
    ];

    const missingFields = requiredFields.filter(field => 
      !data[field] || data[field].toString().trim() === ''
    );

    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `The following required fields are missing: ${missingFields.join(', ').replace(/_/g, ' ')}`
      };
    }

    if (!get().validateEmail(data.email)) {
      return {
        isValid: false,
        message: 'Please provide a valid email address'
      };
    }

    if (!get().validatePhoneNumber(data.phone_number)) {
      return {
        isValid: false,
        message: 'Please provide a valid phone number'
      };
    }

    return { isValid: true };
  },

  // Reset all state
  resetStore: () => set({
    loading: false,
    error: null,
    registration: null,
    userExists: false,
    stats: null,
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      country_of_origin: '',
      state_of_origin: '',
      local_government_area: '',
      address: '',
      highest_level_of_education: '',
      field_of_study: '',
      institution_name: '',
      graduation_year: '',
      employment_status: '',
      years_of_experience: '',
      job_title: '',
      company_name: '',
      preferred_training_track: '',
      training_mode: '',
      preferred_start_date: '',
      training_duration_preference: '',
      programming_languages: [],
      frameworks_and_technologies: []
    }
  })
}));

export default useTrainingStore;